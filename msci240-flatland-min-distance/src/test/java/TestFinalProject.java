/**
 * @author Raina Kwok
 * [MSCI 240] Final Project - A
 * Date: Dec 22, 2022
 * 
 * TestFinalProject
 * 
 * A test class that tests the final project as well as the CityGraph used by the final project
 * (Template adapted from GitHub Classrooms example projects)
 * 
 * Uses JUnit 5
 * 
 * 11 unit tests, 1 helper method
 * 
 */

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;
import java.util.Scanner;
import java.io.*;


public class TestFinalProject {

   public static final PrintStream CONSOLE = System.out;
   public static final File SAMPLE_FILE = new File("src/main/java/sample.txt");
   public static final File FILE1 = new File("src/main/java/input1.txt");
   
   
   ///////////////////////
   /// CityGraph tests ///
   ///////////////////////

   /// Constructor + addCity + addEdge ///

   // Typical //

   @Test
   /**
    * Test_CityGraph_CreateGraph_OneCity()

	 * Justification:
	 * - Tests that CityGraph constructor with size 1 entered in parameter 
    *   is initialized to the correct size with the correct CityNode
    * - Tests that addCity method works correctly (doesn't change size of graph)
    * 
	 * Characteristics:
    * - 1 city
    * - [0] Vancouver
	 * 
    */
   public void Test_CityGraph_CreateGraph_OneCity(){
      //Check initial state of graph
      CityGraph g = new CityGraph(1);
      assertEquals(1, g.getSize());
      assertEquals(-1, g.getIndex("Vancouver"));

      //Check addCity method and that size of graph doesn't change
      g.addCity("Vancouver");
      assertEquals(1, g.getSize());
      assertEquals(0, g.getIndex("Vancouver"));
   }
   
   @Test
   /**
    * Test_CityGraph_CreateGraph_ManyCities()

	 * Justification:
	 * - Tests that CityGraph constructor with size 3 entered in parameter 
    *   is initialized to the correct size with the correct CityNodes
    * - Tests that addCity and addEdge method works correctly (doesn't change size of graph)
    * 
	 * Characterstics:
    * - 3 cities
    * - [0] Vancouver
    * - [1] Toronto
    * - [2] Montreal
	 * 
    */
   public void Test_CityGraph_CreateGraph_ManyCities(){
      //Check initial state of graph
      CityGraph g = graph_3c();
      assertEquals(3, g.getSize());
      assertEquals(0, g.getIndex("Vancouver"));
      assertEquals(1, g.getIndex("Toronto"));
      assertEquals(2, g.getIndex("Montreal"));
      assertEquals(-1, g.getIndex("Kelowna"));
   }

   // Extreme //

   @Test
   /**
    * Test_CityGraph_CreateGraph_AddSameCity()
    * 
	 * Justification:
	 * - Tests that addCity method does nothing when the city to be added already exists in the graph

	 * Characteristics:
    * - 2 cities
    * - [0] Vancouver
    * - [1] Toronto
    * 
    */
   public void Test_CityGraph_CreateGraph_AddSameCity(){
      CityGraph g = new CityGraph(2);
      g.addCity("Vancouver");
      g.addCity("Toronto");
      g.addCity("Vancouver"); //nothing happens since Vancouver already exists in graph
      assertEquals(2, g.getSize());
      assertEquals(0, g.getIndex("Vancouver"));
   }
   
   // Expected Failures //

   @Test
   /**
    * Test_CityGraph_CreateGraph_NoCities()

	 * Justification:
	 * - Tests that CityGraph constructor accepts size 0 entered in parameter
    * - Tests that addCity method throws an IllegalArgumentException when size of graph is 0

	 * Characteristics:
    * - 0 cities
    * 
	 * Expected exception: IllegalArgumentException()
    * 
    */
   public void Test_CityGraph_CreateGraph_NoCities(){
      CityGraph g = new CityGraph(0);
      assertEquals(0, g.getSize());
		assertThrows(IllegalArgumentException.class, () -> g.addCity("Vancouver"));
		assertThrows(IllegalArgumentException.class, () -> g.addEdge("Vancouver", "Toronto", 10.4));
   }

   @Test
   /**
    * Test_CityGraph_CreateGraph_sizeLimit()
    * 
	 * Justification:
    * - Tests that addCity method throws an IllegalArgumentException when size of graph will be exceeded
    * 
	 * Characteristics:
    * - 3 cities
    * - [0] Vancouver
    * - [1] Toronto
    * - [2] Montreal
    * 
	 * Expected exception: IllegalArgumentException()
	 * 
    */
   public void Test_CityGraph_CreateGraph_sizeLimit(){
      CityGraph g = graph_3c();
		assertThrows(IllegalArgumentException.class, () -> g.addCity("Regina"));
   }
   
   @Test
   /**
    * Test_CityGraph_CreateGraph_NegSize()
    * 
	 * Justification:
    * - Tests that CityGraph constructor throws an IllegalArgumentException when parameter is -1
    *   (since size can't be less than 0)
    * 
	 * Characteristics:
    * - 3 cities
    * - [0] Vancouver
    * - [1] Toronto
    * - [2] Montreal
    * 
	 * Expected exception: IllegalArgumentException()
    * 
    */
   public void Test_CityGraph_CreateGraph_NegSize(){
		assertThrows(IllegalArgumentException.class, () -> new CityGraph(-1));
   }
   
   @Test
   /**
    * Test_CityGraph_CreateGraph_CityDNE()
    * 
	 * Justification:
    * - Tests that addEdge method throws an IllegalArgumentException when one or both cities don't exist
    * 
	 * Characteristics:
    * - 2 cities
    * - [0] Vancouver
    * - [1] Toronto
    * 
	 * Expected exception: IllegalArgumentException()
    * 
    */
   public void Test_CityGraph_CreateGraph_CityDNE(){
      CityGraph g = new CityGraph(2);
      g.addCity("Vancouver");
      g.addCity("Toronto");
		assertThrows(IllegalArgumentException.class, () -> g.addEdge("Vancouver", "Victoria", 1));
		assertThrows(IllegalArgumentException.class, () -> g.addEdge("Kelowna", "Toronto", 5.8));
		assertThrows(IllegalArgumentException.class, () -> g.addEdge("Kelowna", "Victoria", 10));
   }


   /// findMinTurns + findMinDistance ///

   // Typical //

   @Test
   /**
    * Test_CityGraph_findMin_Sample()
    * 
	 * Justification:
    * - Tests that the findMinTurns and findMinDistance methods return the expected values
    *   when the sample file is read in (sample I/O provided)
    * 
	 * Characteristics:
    * - 11 cities
    * - Query
    *    - Source: Saskatoon
    *    - Target: Robsart
    *    - Min. turns: 3 | Min. distance: 471.9
    * 
    */
   public void Test_CityGraph_findMin_Sample() throws FileNotFoundException{

      //Read from file using a Scanner
      Scanner scan = new Scanner(SAMPLE_FILE);

      //Add cities + edges to graph
      CityGraph g = FinalProject.graphFlatland(scan);
      assertEquals(11, g.getSize());

      //Source: Saskatoon, Target: Robsart
      assertEquals(3, g.findMinTurns("Saskatoon", "Robsart"));
      assertEquals(471.9, g.findMinDistance("Saskatoon", "Robsart"));
      //Same thing but source and target city is switched
      assertEquals(3, g.findMinTurns("Robsart", "Saskatoon"));
      assertEquals(471.9, g.findMinDistance("Robsart", "Saskatoon"));
   }

   @Test
   /**
    * Test_CityGraph_findMin_Input1()
    * 
	 * Justification:
    * - Tests that the findMinTurns and findMinDistance methods return the expected values
    *   when the input1.txt file is read in
    * 
	 * Characteristics:
    * - 5 cities
    * - [0] Vancouver
    * - [1] Toronto
    * - [2] Montreal
    * - [3] Kelowna
    * - [4] Abbotsford
    * - Query1
    *    - Source: Vancouver
    *    - Target: Abbotsford
    *    - Min. turns: 1 | Min. distance: 14.0
    * - Query2
    *    - Source: Toronto
    *    - Target: Vancouver
    *    - Min. turns: 0 | Min. distance: 11.0
    * 
    */
   public void Test_CityGraph_findMin_Input1() throws FileNotFoundException{

      //Read from file using a Scanner
      Scanner scan = new Scanner(FILE1);

      //Add cities + edges to graph
      CityGraph g = FinalProject.graphFlatland(scan);
      assertEquals(5, g.getSize());

      //Source: Vancouver, Target: Abbotsford      
      assertEquals(1, g.findMinTurns("Vancouver", "Abbotsford"));
      assertEquals(14.0, g.findMinDistance("Vancouver", "Abbotsford"));
      //Source: Toronto, Target: Vancouver
      assertEquals(0, g.findMinTurns("Toronto", "Vancouver"));
      assertEquals(11.0, g.findMinDistance("Toronto", "Vancouver"));

   }

   // Extreme //

   
   @Test
   /**
    * Test_CityGraph_findMin_SameCity()
    * 
	 * Justification:
    * - Tests that the findMinTurns and findMinDistance methods return 0 when
    *   source city = target city
    * 
	 * Characteristics:
    * - 3 cities
    * - [0] Vancouver
    * - [1] Toronto
    * - [1] Montreal
    * - Query
    *    - Source: Vancouver
    *    - Target: Vancouver
    *    - Min. turns: 0 | Min. distance: 0
    * 
    */
   public void Test_CityGraph_findMin_SameCity(){
      CityGraph g = graph_3c();
      assertEquals(0, g.findMinTurns("Vancouver", "Vancouver"));
      assertEquals(0, g.findMinDistance("Vancouver", "Vancouver"));
   }

   // Expected Failures //
  
   @Test
   /**
    * Test_CityGraph_findMin_CityDNE()
    * 
	 * Justification:
    * - Tests that the findMinTurns and findMinDistance methods throw an IllegalArgumentException when
    *   source and/or target city don't exist
    * 
	 * Characteristics:
    * - 3 cities
    * - [0] Vancouver
    * - [1] Toronto
    * - [1] Montreal
    * 
	 * Expected exception: IllegalArgumentException()
    * 
    */
   public void Test_CityGraph_findMin_CityDNE(){
      CityGraph g = graph_3c();
      //check findMinTurns
		assertThrows(IllegalArgumentException.class, () -> g.findMinTurns("Vancouver", "Victoria"));
		assertThrows(IllegalArgumentException.class, () -> g.findMinTurns("Kelowna", "Toronto"));
		assertThrows(IllegalArgumentException.class, () -> g.findMinTurns("Kelowna", "Victoria"));
      //check findMinDistance
		assertThrows(IllegalArgumentException.class, () -> g.findMinDistance("Vancouver", "Victoria"));
		assertThrows(IllegalArgumentException.class, () -> g.findMinDistance("Kelowna", "Toronto"));
		assertThrows(IllegalArgumentException.class, () -> g.findMinDistance("Kelowna", "Victoria"));
   }


   //////////////////////
   /// Helper methods ///
   //////////////////////

   /**
    * graph_3c()
    * 
    * Creates a CityGraph with 3 cities
    * 
	 * Characteristics:
    * - 3 cities
    * - [0] Vancouver
    * - [1] Toronto
    * - [2] Montreal
    * - Vancouver Toronto 10
    * - Toronto Montreal 2
    * - Montreal Vancouver 9

    * @return
    */
   private CityGraph graph_3c(){
      CityGraph g = new CityGraph(3);
      g.addCity("Vancouver");
      g.addCity("Toronto");
      g.addCity("Montreal");
      g.addEdge("Vancouver", "Toronto", 10);
      g.addEdge("Toronto", "Montreal", 2);
      g.addEdge("Montreal", "Vancouver", 9);
      return g;
   }
}