using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameHandler : MonoBehaviour
{
    public Camera referenceCamera;
    public ScreenshotHandler refcameraScreenShot, camera0ScreenShot;
    public RotatingFrame frame;

    // Start is called before the first frame update
    private void Start()
    {
        referenceCamera = GameObject.Find("referenceCamera").GetComponent<Camera>();
        refcameraScreenShot = referenceCamera.GetComponent<ScreenshotHandler>();

        frame = GameObject.Find("rotatingFrame").GetComponent<RotatingFrame>();
    }


    // Update is called once per frame
    private void Update()
    {
        refcameraScreenShot.TakeScreenshots(500, 500);
        frame.LaunchRotatingCamera();

        if (frame.cameraIndexPosition >= frame.cameraIndexMax)
            Application.Quit();
    }
}
