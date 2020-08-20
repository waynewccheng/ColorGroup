using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameHandler : MonoBehaviour
{
    public Camera referenceCamera;
    public ScreenshotHandler refcameraScreenShot, camera0ScreenShot;
    public RotatingFrame frame;
    private bool takeReferenceCamScreenShot = true;
    public int imageWidth = 500, imageHeight = 500;
    public static Color32[,] pixelsArray;


    // Start is called before the first frame update
    private void Start()
    {
        // Reference camera
        referenceCamera = GameObject.Find("referenceCamera").GetComponent<Camera>();
        refcameraScreenShot = referenceCamera.GetComponent<ScreenshotHandler>();

        // Rotating camera
        frame = GameObject.Find("rotatingFrame").GetComponent<RotatingFrame>();
        frame.imageWidth = imageWidth;
        frame.imageHeight = imageHeight;
        frame.pixelsArray = new Color32[imageWidth * imageHeight, frame.cameraIndexMax];
    }


    // Update is called once per frame
    private void Update()
    {
        // To make sure only one screenshot in taken for the reference camera
        if (takeReferenceCamScreenShot)
        {
            refcameraScreenShot.TakeScreenshots(imageWidth, imageHeight);
            takeReferenceCamScreenShot = false;
        }

        frame.LaunchRotatingCamera();

        if (frame.cameraIndexPosition >= frame.cameraIndexMax)
        {
            // Debug.Log("HERE");
            Application.Quit();
        }

    }
}
