using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameHandler : MonoBehaviour
{
    public Camera referenceCamera;
    public ScreenshotHandler refcameraScreenShot, camera0ScreenShot;
    public RotatingFrame frame;
    private bool takeReferenceCamScreenShot = true;
    //public ReadWriteData rwdt;

    // Start is called before the first frame update
    private void Start()
    {
        // Reference camera
        referenceCamera = GameObject.Find("referenceCamera").GetComponent<Camera>();
        refcameraScreenShot = referenceCamera.GetComponent<ScreenshotHandler>();

        // Rotating camera
        frame = GameObject.Find("rotatingFrame").GetComponent<RotatingFrame>();
    }


    // Update is called once per frame
    private void Update()
    {
        // To make sure only one screenshot in taken for the reference camera
        if (takeReferenceCamScreenShot)
        {
            refcameraScreenShot.TakeScreenshots(500, 500);
            takeReferenceCamScreenShot = false;
        }

        frame.LaunchRotatingCamera();

        //if (frame.cameraIndexPosition >= frame.cameraIndexMax)
        //{
        //    Application.Quit();
        //}

    }
}
