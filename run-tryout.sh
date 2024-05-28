#! /bin/bash

# direct
node -r esm direct/tex2chtml-page tryout/example.html >tryout/direct-tex2chtml-page.html
node -r esm direct/tex2svg-page tryout/example.html >tryout/direct-tex2svg-page.html

# jsdom
node -r esm jsdom/tex2chtml-page tryout/example.html >tryout/jsdom-tex2chtml-page.html
node -r esm jsdom/tex2svg-page tryout/example.html >tryout/jsdom-tex2svg-page.html

# preload
node -r esm preload/tex2chtml-page tryout/example.html >tryout/preload-tex2chtml-page.html
node -r esm preload/tex2svg-page tryout/example.html >tryout/preload-tex2svg-page.html

# simple
node -r esm simple/tex2chtml-page tryout/example.html >tryout/simple-tex2chtml-page.html
node -r esm simple/tex2svg-page tryout/example.html >tryout/simple-tex2svg-page.html

# speech
node -r esm speech/tex2chtml-speech-page tryout/example.html >tryout/speech-tex2chtml-speech-page.html
node -r esm speech/tex2svg-page tryout/example.html >tryout/speech-tex2svg-page.html