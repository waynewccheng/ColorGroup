// Screen shot acquisition code based on the one from https://www.youtube.com/watch?v=lT-SRLKUe5k

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ScreenshotHandler : MonoBehaviour
{
    private static ScreenshotHandler instance;
    private Camera myCamera;
    private bool takeScreenshotOnNextFrame;
    public float cameraYRotation;
    public int cameraIndexPosition;
    public Color32[] pixels;

    private void Awake()
    {
        instance = this;
        myCamera = gameObject.GetComponent<Camera>();
    }


    private void OnPostRender()
    {
        // Screenshot
        if (takeScreenshotOnNextFrame)
        {
            takeScreenshotOnNextFrame = false;
            RenderTexture renderTexture = myCamera.targetTexture;

            Texture2D renderResult =
                new Texture2D(renderTexture.width,
                renderTexture.height,
                TextureFormat.ARGB32, false);
            Rect rect = new Rect(0, 0, renderTexture.width, renderTexture.height);
            renderResult.ReadPixels(rect, 0, 0);

            // Get the RGBA pixel values
            pixels = renderResult.GetPixels32();

            // Get and save png images
            string imageFileName = ImageScreenShotName(renderTexture.width,
                renderTexture.height, cameraYRotation);
            byte[] byteArray = renderResult.EncodeToPNG();
            System.IO.File.WriteAllBytes(imageFileName, byteArray);

            // Save pixel in a 2D array
            string dataFileName = DataScreenShotName(renderTexture.width,
                renderTexture.height, cameraYRotation);
            ReadWriteData.WriteString("Assets/Data/Test.txt", pixels[1].ToString());
            ReadWriteData.WriteRGBA(dataFileName, pixels);

            RenderTexture.ReleaseTemporary(renderTexture);
            myCamera.targetTexture = null;
        }
    }


    public void TakeScreenshots(int width, int height)
    {
        myCamera.targetTexture = RenderTexture.GetTemporary(width, height, 16);
        takeScreenshotOnNextFrame = true;
    }


    private static string ImageScreenShotName(int width, int height, float cameraYRotation)
    {
        string path = Application.dataPath;
        string imageFileName = string.Format("{0}/ScreenShots/screen_{1}x{2}_{3}.png",
            path, width, height, cameraYRotation.ToString());
        return imageFileName;
    }

    private static string DataScreenShotName(int width, int height, float cameraYRotation)
    {
        string path = Application.dataPath;
       string dataFileName = string.Format("{0}/Data/screen_{1}x{2}_{3}.txt",
            path, width, height, cameraYRotation.ToString());
        return dataFileName;
    }
}
