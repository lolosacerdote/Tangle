# Tangle — Fix Pack 01 (Aplicado)
Este paquete incluye:
- Archivos de ayuda en `lib/`: persist.ts, api.ts, debounce.ts, section-props.ts
- Ajustes sugeridos en `app/page.tsx` (usar currentGroup?.id y persistencia)
- Bloque CSS para la bottom nav en `styles/globals.css`

## Cómo usar en GitHub
1. En tu repo, abrí la rama `fixpack01`.
2. Subí estos archivos en las carpetas correctas (`lib/`, `styles/`).
3. Editá `app/page.tsx` y las secciones para aceptar `currentGroupId` como `string | null` opcional.
4. Commit a `fixpack01`.
5. Abrí un Pull Request hacia `main` y probá el Preview en Vercel.
