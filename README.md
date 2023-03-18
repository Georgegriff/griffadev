# griffadev

Code for https://griffa.dev

```
npm install
```

Dev

```
npm start
```

Prod

```
npm run build
```

## Fixing sharp error on M1 Macs

```
npm install
npm install --platform=darwin --arch=arm64 sharp
npm install --arch=x64 --platform=darwin sharp
```

npm install --platform=darwin --arch=arm64v8 sharp

npm rebuild --platform=darwin --arch=arm64v8 sharp
