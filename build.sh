GENERATED=generated

echo "Cleaning $GENERATED folder"
rm -rf $GENERATED
mkdir -p $GENERATED

echo "Validate and download jQuery if needed"
JQUERY_FILE_NAME="jquery-4.0.0.min.js"
JQUERY_URL="https://code.jquery.com/$JQUERY_FILE_NAME"
JQUERY_FILE="src/thirdparty/ad$JQUERY_FILE_NAME"
EXPECTED_SHA256="OaVG6prZf4v69dPg6PhVattBXkcOWQB62pdZ3ORyrao="

# Verify jQuery hash
CURRENT_SHA256=$(openssl dgst -sha256 -binary "$JQUERY_FILE" | base64)

echo "Expected SHA256: $EXPECTED_SHA256"
echo "Current SHA256 : $CURRENT_SHA256"

if [ "$EXPECTED_SHA256" = "$CURRENT_SHA256" ]; then
    echo "jQuery file verified - hash matches, no download needed"
else
    echo "jQuery file hash mismatch - downloading new version"
    curl -s "$JQUERY_URL" -o "$JQUERY_FILE"
    if [ $? -eq 0 ]; then
        echo "jQuery downloaded successfully to $JQUERY_FILE"
    else
        echo "Failed to download jQuery, using existing file"
    fi
fi

echo "Building for Chrome"
cd src
zip -rq ../$GENERATED/chrome-stt.zip * -x "*.DS_Store"
cd ..

echo "Building for Firefox"
FIREFOX=$GENERATED/firefox
mkdir -p $FIREFOX
echo "Copying src to $FIREFOX folder"
cp -r src/. $FIREFOX/

echo "Manipulating files"
cd $FIREFOX
rm -f manifest.json
cp ../../resources/manifest-ff-v2.json manifest.json
sed -i '' -e 's/chrome.action./chrome.browserAction./g' background.js

zip -rq ../firefox-stt.zip * -x "*.DS_Store"
cd ../..
echo "Build Completed"
