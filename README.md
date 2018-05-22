# Tifo

Developed by Austin Berke, Ali Hashemi, and Jerin Tomy for LA Hacks.

Awarded Best Entertainment Hack at LA Hacks 2018.

[Demo Video](https://www.youtube.com/watch?v=RD6708H37Nw) |
[Devpost](https://devpost.com/software/tifo-ragx46)

---

## Introduction

Tifo is a web application developed using Express, Node.js, and Python, designed to enable synchonized playback of a video divided
over multiple mobile devices. The concept was inspired by the tradition of [Tifo](https://en.wikipedia.org/wiki/Tifo), a coreographed
visual display performed by members of a crowd holding up colored cards at a sporting event. We wanted to emulate this behavior using
modern technology that virtually everyone has handy -- cell phones.

## How It Works

* An administrator prepares the video for playback using the admin panel. The video is uploaded as an MP4, the seatmap is defined
in a CSV, and the number of pixels (rows x cols) to be displayed per device is configued according to the desired output.
* A Python script is run which processes the video into a vector of colors over time per each block of pixels in the video. 
* Users can connect to the client-side interface and enter in their seat location.
* Upon receiving a start signal from the admin panel, all clients will begin playback of their portion of the video in full
synchronization.
* Every so often, video playback will nudge itself back into a synchronized state to ensure consistency between devices.

![TifoExample](https://i.imgur.com/Uu69gAn.png)

## Usage

`npm start`

## License

MIT License

Copyright (c) 2018 Tifo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
