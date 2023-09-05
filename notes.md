- Add / Edit / Delete Varian di Detail Master
- Update Status Tool
- Add Borken / Miss Button

- Konfirmasi Password Manager berdasarkan Unit dari user yang sedang login
- Update Status ketika sedang dipinjam, missing / broken (trigger dari upload document / file)
-

5 Juni 2023

Transaksi

- [DONE]Transaksi / Advance dibutuhkan Manager. Jika tidak perlu Advance ada Value default nya yaitu hari Ini dan Estimated Return adlah +24jam
- [DONE]Ketika submit isi password peminjam
- [DONE]Menambahkan field (tool_keeper_personal_number, tool_keeper_personal_name) Tool Keeper (yang sedang login)

  Tool

- Tambahkan Kategori / Pindahkan dari Part Number. Output dari sebuah category adalah Unique Key dari kombinasi Category + Store (GSEH1xxxxxx)
- Manufacture, freetext / dropdown???
- Abilitas Edit Tool pada Detail Part Number berdasarkan Unit nya...
- Tools Belong to Unit -> Location

6 Juni 2023+
Report

- Transaksi
  Export Detail + Export View
- Tool

7 Juni 2023

- Tambah Field Category di Table Tool

TZ => GSXH40012 => tool_number

Change:

- added new Column "category" with text value & nullable
- changed column location_id to location(varchar)
- transit_id is nullable now
