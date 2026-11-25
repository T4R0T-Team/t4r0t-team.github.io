## Description

The challenge gave a VirtualBox-derived memory dump called `second.dmp` and one short hint:

> Yo, check out what I made yesterday, pretty cool eh?

The task was to work out what the creator had made, find the useful forensic artifacts, and recover the flag. The main evidence was a roughly 8.87 GB dump of a Windows 11 system, even though the outer file format was an ELF core.

![The challenge on the I-Hack CTF 2026 dashboard](writeups/kryy/img/wrath-challenge.webp)

## Enumeration: identify the memory image

I first inspected the memory file in Kali Linux and used Volatility 3 to identify the OS and running processes.

![The supplied second.dmp file](writeups/kryy/img/wrath-dump-file.webp)

```bash
file /media/sf_second/second.dmp
vol -f /media/sf_second/second.dmp windows.info
vol -f /media/sf_second/second.dmp windows.pslist
vol -f /media/sf_second/second.dmp windows.cmdline
```

Volatility parsed the guest as Windows 11 (build 22621). A particularly interesting process was `FL64.exe` (PID `4180`), which belongs to FL Studio 2026. The system time was 29 July 2026 (UTC), so the "yesterday" clue pointed toward artifacts from 28 July.

## Finding the FL Studio artifacts

Window titles and recent documents showed an open FL Studio project named `my incredible music`. Recent-file references included `first.flp`, `second.flp`, `sick song.flp` and `incredible music.flp`, plus references to backups from 28 July.

```bash
vol -f /media/sf_second/second.dmp windows.windows.Windows
vol -f /media/sf_second/second.dmp windows.filescan
vol -f /media/sf_second/second.dmp windows.handles
```

I tried recovering a full FL Studio project through file scanning, process memory extraction and FLP-header carving. The candidates were either too small or belonged to presets, so this path didn't give me the complete artifact.

```bash
mkdir -p ~/fl_memory
vol -f /media/sf_second/second.dmp -o ~/fl_memory \
  windows.memmap --pid 4180 --dump
```

Instead of searching for project files over and over, I looked at the extra modules loaded into FL Studio.

## Extracting the suspicious plugin

The loaded-module listing showed a CLAP audio plugin named `Arranger.clap`, mapped into the FL Studio process at image base `0x7ff803670000`. Another plugin, `Integrate.clap`, showed up during the wider artifact search.

```bash
vol -f /media/sf_second/second.dmp windows.dlllist --pid 4180

mkdir -p ~/plugin_recovery
vol -f /media/sf_second/second.dmp -o ~/plugin_recovery \
  windows.dlllist.DllList --pid 4180 --base 0x7ff803670000 --dump
```

The extracted file was `pid.4180.Arranger.clap.0xbb36e40.0x7ff803670000.dmp`, which `file` identified as a 64-bit Windows PE DLL. Running strings on it revealed unusual developer-specific values, including `industry_secrets` and a `Key generation button toggled to:` message.

```bash
file ~/plugin_recovery/*Arranger.clap*.dmp
strings -a -td ~/plugin_recovery/*Arranger.clap*.dmp | \
  grep -iE 'industry_secrets|generation|ihack'
```

## Reverse engineering with Radare2

I opened the module in Radare2, searched its strings, then followed the cross-references. There were two instances of `industry_secrets` in the read-only data section, and the key-generation message was at another nearby address.

```bash
r2 -A ~/plugin_recovery/*Arranger.clap*.dmp

izz~industry_secrets
izz~generation
axt @ 0x7ff803723910
axt @ 0x7ff803723d40
axt @ 0x7ff803723b4d
```

These references led to code near `0x7ff8036aefe0`. The key discovery was a routine that builds a string by writing constant bytes into a 64-byte buffer. Because the bytes are encoded as instruction immediates, the full string never exists as one readable literal in the binary.

```bash
pdf @ 0x7ff8036aefe0
pd 100 @ 0x7ff8036af05d
```

![Immediate values and consecutive buffer writes in the string-building function](writeups/kryy/img/wrath-r2-immediates.webp)

## Reconstructing the string

The first instructions make the output format recognizable. On x86-64, immediate integer bytes are stored little-endian, so for example `0x74346877` decodes as `wh4t`.

```nasm
0x7ff8036af01c   mov dword [rdi], 0x63616869
0x7ff8036af044   mov word [rdi+4], 0x7b6b
0x7ff8036af07a   mov dword [rax], 0x74346877
0x7ff8036af080   mov word [rax+4], 0x645f
0x7ff8036af0ab   movabs rax, 0x77306e6b5f315f30
0x7ff8036af0be   movabs rax, 0x745f74753062345f
0x7ff8036af0e9   movabs rcx, 0x6c7230775f733168
0x7ff8036af125   mov dword [rdi+0x29], 0x7d707364
```

Following the destination offsets `[rdi]`, `[rdi+4]`, `[rdi+6]`, `[rdi+0xc]` and onward gave me the order of the pieces. The final write at `[rdi+0x29]` supplies the closing bytes.

![Final string pieces, buffer offsets and the return path](writeups/kryy/img/wrath-r2-final.webp)

I also checked the branch and error-handler code below the routine. It's memory-allocation failure handling, not extra flag characters.

![Surrounding branches and error-handling code](writeups/kryy/img/wrath-r2-branches.webp)

## Recovered flag

Reading the immediate operands in the order set by their buffer offsets gives:

```flag
ihack{wh4t_d0_1_kn0w_4b0ut_th1s_w0rld_of_dsp}
```

This comes straight from the disassembly of the extracted `Arranger.clap` module. I don't have a screenshot of the scoreboard accepting it, so I'm calling it recovered from the binary rather than platform-verified.

I also wrote a small Python script that reads the immediate operands from the recovered module, checks their opcodes and assembles the result, without the full flag sitting in the script as a literal:

```bash
python3 extract_ihack_flag.py \
  ~/plugin_recovery/pid.4180.Arranger.clap.0xbb36e40.0x7ff803670000.dmp
```

## Conclusion

This started as memory forensics on what looked like a normal music-production session. The useful lead wasn't a recoverable FL Studio project, it was a loaded audio plugin. Volatility 3 gave me the process and DLL evidence, and Radare2 exposed a function that built the hidden text from instruction-level constants.

The lesson: a useful artifact can live inside a mapped module even when the original document or project file can't be recovered. Following process context, loaded modules and code cross-references worked much better than just running strings.

Happy hacking!
