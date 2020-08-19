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
    public Color32[,] pixArray;
    private Color32[] pixels;

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

            // Get the rgb pixel values
            pixels = renderResult.GetPixels32();

            // Get and save png images
            string filename = ScreenShotName(renderTexture.width,
                renderTexture.height, cameraYRotation);
            byte[] byteArray = renderResult.EncodeToPNG();
            System.IO.File.WriteAllBytes(filename, byteArray);

            // Save pixel in a 2D array
            //SavePixels(pixels, cameraIndexPosition);
            ReadWriteData.WriteString("Assets/Data/Test.txt");

            RenderTexture.ReleaseTemporary(renderTexture);
            myCamera.targetTexture = null;
        }
    }


    public void TakeScreenshots(int width, int height)
    {
        myCamera.targetTexture = RenderTexture.GetTemporary(width, height, 16);
        takeScreenshotOnNextFrame = true;
    }


    private static string ScreenShotName(int width, int height, float cameraYRotation)
    {
        string path = Application.dataPath;
        return string.Format("{0}/ScreenShots/screen_{1}x{2}_{3}.png",
            path, width, height, cameraYRotation.ToString());
    }

    private void SavePixels(Color32[] p, int j)
    {
        for (int i = 0; i <= p.Length; i++)
            pixArray[i, j] = pixels[i];
    }
}
