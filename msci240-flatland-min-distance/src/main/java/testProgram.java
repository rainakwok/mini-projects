
import java.util.*;
import java.io.*;

public class testProgram {
    
    public static File SAMPLE_FILE = new File("src/main/java/input1.txt");
   
    public static void main(String[] args) throws FileNotFoundException{
        
        //Read from file using a Scanner
        Scanner scan = new Scanner(SAMPLE_FILE);

        //Add cities + edges to graph
        CityGraph g = FinalProject.graphFlatland(scan);

        //Read in queries and print min turns + distance for each query
        FinalProject.readQueries(scan, g);        
        
    }

}
