# Impostor

Spoločenská hra na jednom mobile, po slovensky. Funguje offline ako PWA.

## Spustenie na mobile (GitHub Pages)

1. Na github.com vytvor verejný repozitár, napr. `impostor`.
2. Nahraj doň obsah tohto priečinka (Add file → Upload files).
3. Settings → Pages → Source: „Deploy from a branch“, vetva `main`, priečinok `/ (root)` → Save.
4. O minútu je hra na `tvojemeno.github.io/impostor`.
5. Otvor adresu v mobile a pridaj na plochu:
   - Android (Chrome): menu ⋮ → „Pridať na plochu“ / „Inštalovať aplikáciu“.
   - iPhone (Safari): Zdieľať → „Pridať na plochu“.
6. Raz otvor hru z plochy s internetom. Potom ide aj v režime lietadlo.

## Úpravy

- Slová a kategórie: `words.js`.
- Farby a písma: `:root` na začiatku `style.css`.
- Po každej zmene zvýš `VERZIA` v `sw.js` (napr. `impostor-v2`), inak mobil ukáže starú verziu.
- Test na počítači: v tomto priečinku spusti `python3 -m http.server` a otvor `http://localhost:8000`.
