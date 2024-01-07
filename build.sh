GENERATED=generated

echo "Cleaning $GENERATED folder"
rm -rf $GENERATED
mkdir -p $GENERATED

echo "Building for Chrome"
cd src
zip -rq ../$GENERATED/chrome-stt.zip * -x "*.DS_Store"
cd ..

echo "Building for Firefox"
FIREFOX=$GENERATED/firefox
mkdir -p $FIREFOX
echo "Copying src to $FIREFOX folder"
cp -r src/ $FIREFOX/

echo "Manipulating files"
cd $FIREFOX
rm -f manifest.json
cp ../../resources/manifest-ff-v2.json manifest.json
sed -i '' -e 's/chrome.action./chrome.browserAction./g' background.js

zip -rq ../firefox-stt.zip * -x "*.DS_Store"
cd ../..
echo "Build Completed"
