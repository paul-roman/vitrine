#!/bin/sh
# Get Electron current version from package.json and build every Node native module based on the directories name.

ELECTRON_URL=https://atom.io/download/electron
ELECTRON_VERSION=$(grep '"electron":' ../package.json | sed -E 's/[ ]+"electron": "[\^]?(.*)"[,]?/\1/')

mkdir -p ../modules
cd ../sources/modules || exit

dirs=( $(find . -maxdepth 1 -type d -printf '%P\n') )
echo "${#dirs[@]} Node native module(s) are about to be built."

for dir in "${dirs[@]}"; do
	echo "Building $dir..."
	cd "$dir" || exit
	../../../node_modules/.bin/node-gyp rebuild --target="$ELECTRON_VERSION" --arch=x64 --dist-url="$ELECTRON_URL"
	mv build/Release/"$dir".node ../../../modules
	rm -R build
	cd ..
	echo "$dir built completed!"
done
