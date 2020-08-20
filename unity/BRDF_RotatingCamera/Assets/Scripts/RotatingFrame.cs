using System;
using UnityEngine;

public class RotatingFrame : MonoBehaviour
{
    private static RotatingFrame instance;
    public Camera rotatingCamera;
    public ScreenshotHandler rotcameraScreenShot;
    public int imageWidth, imageHeight;

    public int degreesPerStep = 10,
        cameraAngleStartPosition = -80;

    public int cameraIndexPosition = 0;
    public int cameraIndexMax = 17;
    float timer = 0f;
    public Color32[,] pixelsArray;

    private void Awake()
    {
        instance = this;

        rotatingCamera = GameObject.Find("rotatingCamera").GetComponent<Camera>();
        rotcameraScreenShot = rotatingCamera.GetComponent<ScreenshotHandler>();
    }

    void UpdateDiscrete()
    {
        // Frame rotation angle
        int angle = cameraAngleStartPosition + cameraIndexPosition * degreesPerStep;

        // Update cameraYRotation for name of saved image 
        rotcameraScreenShot.cameraYRotation = angle;

        // Update cameraIndexPosition for RGB array indexing
        rotcameraScreenShot.cameraIndexPosition = cameraIndexPosition;

        if (cameraIndexPosition < cameraIndexMax)
        {
            transform.localRotation = Quaternion.Euler(0f,
                (float)(cameraAngleStartPosition + cameraIndexPosition * degreesPerStep), 0f);
            rotcameraScreenShot.TakeScreenshots(imageWidth, imageHeight);
            // AddToPixelArray(rotcameraScreenShot.pixels, cameraIndexPosition);
            cameraIndexPosition += 1;
        }
    }

    private void AddToPixelArray(Color32[] p, int col)
    {
        for (int i = 0; i < p.Length; i++)
        {
            pixelsArray[i, col] = p[i];
        }
    }

    public void LaunchRotatingCamera()
    {
        // First camera position, no waiting time
        if (cameraIndexPosition == 0)
            UpdateDiscrete();
        else
        {
            // Timer
            timer += Time.deltaTime;

            if (timer > 1)
            {
                UpdateDiscrete();
                timer = 0f;
            }
        }
    }
}
