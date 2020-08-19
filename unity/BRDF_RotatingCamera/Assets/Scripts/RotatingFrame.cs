using System;
using UnityEngine;

public class RotatingFrame : MonoBehaviour
{
    private static RotatingFrame instance;
    public Camera rotatingCamera;
    public ScreenshotHandler rotcameraScreenShot;

    public float degreesPerStep = 10f,
        cameraAngleStartPosition = -80f;

    public int cameraIndexPosition = 0;
    public int cameraIndexMax =  17;
    float timer = 0f;

    private void Awake()
    {
        instance = this;

        rotatingCamera = GameObject.Find("rotatingCamera").GetComponent<Camera>();
        rotcameraScreenShot = rotatingCamera.GetComponent<ScreenshotHandler>();
    }

    void UpdateDiscrete()
    {
        // Frame rotation angle
        float angle = cameraAngleStartPosition + cameraIndexPosition * degreesPerStep;

        // Update cameraYRotation for name of saved image 
        rotcameraScreenShot.cameraYRotation = angle;

        // Update cameraIndexPosition for RGb array indexing
        rotcameraScreenShot.cameraIndexPosition = cameraIndexPosition;

        if (cameraIndexPosition < cameraIndexMax)
        {
            //Debug.Log(cameraIndexPosition);
            transform.localRotation = Quaternion.Euler(0f,
                cameraAngleStartPosition + cameraIndexPosition * degreesPerStep, 0f);
            rotcameraScreenShot.TakeScreenshots(500, 500);
            cameraIndexPosition += 1;
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
