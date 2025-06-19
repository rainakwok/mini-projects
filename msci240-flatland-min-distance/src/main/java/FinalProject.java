/**
 * @author Raina Kwok
 * [MSCI 240] Final Project - A
 * Date: Dec 22, 2022
 * 
 * FinalProject.java
 * 
 * An initial class for the final project code
 * It uses a Scanner to read in file1 containing information to create a weighted graph
 * Then, it reads in a series of queries to print the minimum number of turns and smallest distance to get from
 * a source city to a target city
 * 
 * Consists of:
 * - a main program
 * - 2 static methods used in main program: graphFlatland(Scanner scan), readQueries(Scanner scan, CityGraph g)
 * - 2 helper methods: getNextScan(Scanner scan, String errmsg), getNextIntScan(Scanner scan, String errmsg)
 * 
 */

import java.util.Scanner;
import java.io.File;
import java.io.FileNotFoundException;

public class FinalProject {

    public static final File FILE1 = new File("src/main/java/sample.txt");

    /**
     * Main program
     * 
     * @param args
     * @throws FileNotFoundException when file read through scanner is not found
     */
    public static void main(String[] args) throws FileNotFoundException{

        //a Scanner class in case you want to use it to read from standard input
        Scanner scan = new Scanner(FILE1);

        //Add cities + edges to graph
        CityGraph g = graphFlatland(scan);

        //Read in queries and print min turns + distance for each query
        readQueries(scan, g);
    }

    /**
     * Creates and maps the cities in Flatland (with n nodes and m edges) according to the given Scanner
     * Returns the resulting CityGraph
     * 
     * Throws an exception whenever input that the scanner is reading from isn't formatted as expected
     * 
     * @param scan Scanner to extract graph information from
     * @return a CityGraph with a specified number of cities and roads (of varying lengths) connecting cities
     */
    public static CityGraph graphFlatland(Scanner scan){
        //Get number of cities (nodes) + handle exception
        int n = getNextIntScan(scan, "Must enter a non-negative integer to indicate the number of nodes");

        //Add cities to graph
        CityGraph g = new CityGraph(n);
        for (int i = 0; i < n; i ++){
            g.addCity(getNextScan(scan, "error"));
        }

        //Get number of edges and their weights + handle exception
        int m = getNextIntScan(scan, "Must enter a non-negative integer to indicate the number of edges");

        //Add weighted edges to graph
        for(int j = 0; j < m; j++){
            if(!scan.hasNextLine()){
                throw new IllegalArgumentException();
            }

            String name1 = getNextScan(scan, "Check that file is in correct format"); //Get name of city 1
            String name2 = getNextScan(scan, "Check that file is in correct format"); //Get name of city 2
            if(!scan.hasNextDouble()){
                throw new IllegalArgumentException("Expected a double as the distance");
            }
            double dist = scan.nextDouble(); //Get distance btwn city 1 and 2
            g.addEdge(name1, name2, dist); //Add edge to graph
        }
        return g;
    }

    /**
     * Given a scanner containing queries, analyzes the given CityGraph and finds/prints:
     * - minimum turns to get from a source city to a target city using BFS
     * - minimum distance between a source city to a target city using Dijkstra's algorithm
     * 
     * @param scan Scanner to extract queries from
     * @param g CityGraph to analyze
     */
    public static void readQueries(Scanner scan, CityGraph g){

        //Get number of queries + handle exception
        int q = getNextIntScan(scan, "Must enter a non-negative to indicate the number of queries");

        //Get min. turns + distances for each query
        for(int k = 0; k < q; k++){
            if(!scan.hasNextLine()){
                throw new IllegalArgumentException();
            }

            //Get source and target city
            String source = getNextScan(scan, "Check that file is in correct format");
            String target = getNextScan(scan, "Check that file is in correct format");

            //Find minimum turns using BFS
            int minTurns = g.findMinTurns(source, target);

            //Find minimum distances using Dijkstra's algorithm
            double minDistance = g.findMinDistance(source, target);

            //Print output of query
            System.out.println("Minimum turns from " + source + " to " + target + ": " + minTurns);
            System.out.printf("Minimum distance from " + source + " to " + target + ": %.1f\n", minDistance);
        }

    }


    //////////////////////
    /// Helper methods ///
    //////////////////////

    /**
     * First checks if there is a next token in the given Scanner
     * - If there is a next token, return the String of the next token
     * - If there is no next token, throw an IllegalArgumentException with the given error message
     * 
     * @param scan Scanner to extract information from
     * @param errmsg Error message to display if incorrect formatting is detected
     * @return String of the next token in Scanner
     */
    private static String getNextScan(Scanner scan, String errmsg){
        if(!scan.hasNext()){
            throw new IllegalArgumentException(errmsg);
        }
        return scan.next();
    }
    
    /** 
     * First checks if there is a next token in the given Scanner that can be interpreted as an integer
     * - If there is a next integer token, return that integer if it is non-negative
     * - If there is no next integer token or if it's negative,
     *   throw an Exception with the given error message
     * 
     * @param scan Scanner to extract information from
     * @param errmsg Error message to display if incorrect formatting is detected
     * @return the next integer token in Scanner
     */
    private static int getNextIntScan(Scanner scan, String errmsg){
        if(!scan.hasNextInt()){
            throw new IllegalArgumentException(errmsg);
        }
        int num = scan.nextInt();
        if (num < 0){
            throw new IllegalArgumentException(errmsg);
        }
        return num;
    }

}