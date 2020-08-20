// Original code from https://support.unity3d.com/hc/en-us/articles/115000341143-How-do-I-read-and-write-data-from-a-text-file-

using UnityEngine;
using System.IO;

public class ReadWriteData : MonoBehaviour
{

    public static void WriteString(string path, string data)
    {
        //string path = "Assets/Data/test.txt";

        //Write some text to the test.txt file
        StreamWriter writer = new StreamWriter(path, true);
        writer.WriteLine(data);
        writer.Close();


        ////Re-import the file to update the reference in the editor
        //AssetDatabase.ImportAsset(path);
        //TextAsset asset = Data.Load("test");

        ////Print the text from the file
        //Debug.Log(asset.text);
    }


    public static void WriteRGBA(string path, Color32[] rgba)
    {
        StreamWriter writer = new StreamWriter(path, true);
        string s;
        int firstIndex = 5, lastIndex;
        for (int i = 0; i < rgba.Length; i++)
        {
            s = rgba[i].ToString();
            lastIndex = s.LastIndexOf(")");
            writer.WriteLine(s.Substring(firstIndex, lastIndex - firstIndex));
        }
        writer.Close();
    }

    public static void WriteRGBA2D(string pathToFolder, Color32[,] rgbaArray)
    {
        string path = Application.dataPath;
        Color32[] array = new Color32[rgbaArray.GetLength(1)];

        for (int j = 0; j < rgbaArray.GetLength(2); j++)
        {
            // Set name for each file
            string dataFileName = string.Format("{0}/Data2/screen_{1}.txt", path, j.ToString());

            // Fill 1D array
            for (int i = 0; i < rgbaArray.GetLength(1); i++)
                array[i] = rgbaArray[i, j];

            // Write 1D array
            WriteRGBA(dataFileName, array);
        }
    }

    ////Re-import the file to update the reference in the editor
    //AssetDatabase.ImportAsset(path);
    //TextAsset asset = Data.Load("test");

    ////Print the text from the file

    static void ReadString()
    {
        string path = "Assets/Data/test.txt";

        //Read the text from directly from the test.txt file
        StreamReader reader = new StreamReader(path);
        Debug.Log(reader.ReadToEnd());
        reader.Close();
    }

}