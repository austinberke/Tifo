import moviepy.editor as mp

def main():
    resize(48, 36, "/Users/alihashemi/Desktop/video.mp4", "/Users/alihashemi/Desktop/resized.mp4")

# Resize the video to the given dimensions and save
def resize(w, h, videoFile, resizedVideoFile):
    clip = mp.VideoFileClip(videoFile)
    clip_resized = clip.resize(newsize=(w, h))
    clip_resized.write_videofile(resizedVideoFile)
    print ("Finished Rezising the video")

if __name__ == '__main__':
    main()
