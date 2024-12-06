# React Native Skia - Pixel Canvas Quick Demo 

1. Install dependencies

   ```bash
   yarn install
   ```

2. Start the app

   ```bash
    yarn start
   ```

3. Have not tested on Android / iOS - Mainly used Web for development. Ended up using unistyles 3.0 but this uses nitromodules which meant I had to move to a development build.

## Outcomes:
- Poor performance due to large map size
- upon every touch/pan event, the coordinates of the marked cell would have been stored in a map along with the associated colour
- Whenever the map gets updated, the screen would re-render showing the new marked cells.
- The fix would have been to try minimize the size of the map whilst keeping up with rendering new marked cells - which seemed pretty difficult to do with React Native.
- I figured I'd scrap the work and opt for a better solution using ExpoGL or WebGPU


## Sources:
- [https://samuelscheit.com/blog/2024/react-native-skia-list](https://samuelscheit.com/blog/2024/react-native-skia-list)
- [https://shopify.github.io/react-native-skia/docs/animations/textures/#under-the-hood](https://shopify.github.io/react-native-skia/docs/animations/textures/#under-the-hood)
- [https://github.com/wcandillon/react-native-webgpu](https://github.com/wcandillon/react-native-webgpu)
