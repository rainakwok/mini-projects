/**
 * @author Raina Kwok
 * [MSCI 240] Final Project - A
 * Date: Dec 22, 2022
 * 
 * CityGraph.java
 * 
 * Summary:
 * The CityGraph object acts as a GIS for Flatland that creates, manages, analyzes, and maps the cities within
 * It consists of:
 * - 4 private fields: (final) SIZE, cityList, adjList, distMatrix
 * - 1 constructor: CityGraph(int n)
 * - 4 main methods : addCity(String name), addEdge(String name1, String name2, double distance), 
 *                    findMinTurns(String source, String target), findMinDistance(String source, String target)
 * - 3 helper methods: getSize(), getIndex(String name), getCity(String name)
 *      => some used for gradle unit tests
 * 
 * Input:
 * To create a CityGraph object, you must enter a non-negative integer in the parameter to represent the
 * number of cities in Flatland.
 * Most of the other methods accept a string as the input, representing the city name.
 * The helper methods are used to check if a city with the inputted name exists, and can
 * throw an error or return the corresponnding CityNode object
 * 
 * Output: 
 * CityGraph constructor -> n/a
 * addCity/addEdge -> n/a
 * findMinTurns -> int
 * findMinDistance -> double
 * getIndex -> n/a
 * getCity -> CityNode
 * 
 */

import java.util.*;

public class CityGraph {
    
    private final int SIZE; //number of cities in the graph
    private int nextIndex; //Next free index to assign to new cities
    private ArrayList<CityNode> cityList; //list of all the cities in Flatland
    private Map<CityNode, LinkedList<CityNode>> adjList; //list of adjacent cities
    private double[][] distMatrix; //distances btwn adjacent cities


    /////////////////////////////
    /// CityGraph Constructor ///
    /////////////////////////////

    /**
     * Creates a new CityGraph object with the space to contain n CityNodes (nodes)
     * 
     * Throws an IllegalArgumentException if n < 0
     * 
     * @param n the number of CityNodes in the graph
     */
    public CityGraph(int n){
        if (n < 0){
            throw new IllegalArgumentException("Graph cannot have a negative amount of cities");
        }
        SIZE = n;
        nextIndex = 0;
        cityList = new ArrayList<>();
        adjList = new HashMap<>();
        distMatrix = new double[n][n];
    }


    /////////////////////
    //// Main methods ///
    /////////////////////

    /**
     * Adds a CityNode with the given name (and index of nextIndex) to the graph
     * If a CityNode with the given name already exists, the graph remains unchanged
     * 
     * If the the graph is full (no more spots to add new cities), an exception is thrown
     * 
     * @param name name of the city
     * @param i index of the city
     */
    public void addCity(String name){
        //Assign a CityNode to the integer + add CityNode to adjacency list
        CityNode c = new CityNode(name, this.nextIndex);
        if(!cityList.contains(c)){
            //Ensure that the size of the graph isn't exceeded
            if (cityList.size() >= this.SIZE){
                throw new IllegalArgumentException("Size limit of the graph reached. Cannot add any more cities");
            }

            //Add CityNode to the list of cities and the adjacency list
            cityList.add(c);
            adjList.put(c, new LinkedList<>());

            //Update nextIndex
            this.nextIndex++;
        }
    }

    /**
     * Adds a road with the given length connecting the two given CityNodes
     * 
     * Throws an IllegalArgumentException if CityNodes with the given names don't exist in the graph
     * Throws an IllegalArgumentException if the distance isn't a positive number
     * 
     * @param name1 name of city 1
     * @param name2 name of city 2
     * @param distance distance of the road between the two cities
     */
    public void addEdge(String name1, String name2, double distance){

        //Get cities
        CityNode city1 = getCity(name1); //Get city 1
        CityNode city2 = getCity(name2); //Get city 2

        //throw an exception if distance isn't positive
        if (distance <= 0){
            throw new IllegalArgumentException("Cities must be separated by a positive distance");
        }

        //Get city indexes
        int index1 = city1.getIndex();
        int index2 = city2.getIndex();

        //Update distance matrix
        distMatrix[index1][index2] = distance;
        distMatrix[index2][index1] = distance;    

        //Update adjacency list
        adjList.get(city1).add(city2);
        adjList.get(city2).add(city1);
        
    }

    /**
     * Finds the minimum turns to get from the source to target city using Breadth-First-Search (BFS)
     * 
     * Throws an IllegalArgumentException if either of the given cities don't exist in the graph
     * Returns -100 if target city is never reached, however this will never occur due to
     * the aforementioned exception handling
     * 
     * @param source name of source city
     * @param target name of target city
     * @return minumum number of turns required to get from source to target city
     */
    public int findMinTurns(String source, String target){

        //Get cities
        CityNode cityS = getCity(source);
        CityNode cityT = getCity(target);

        //Handle case where source city = target city
        if (cityS.getIndex() == cityT.getIndex()){
            return 0;
        }

        Map<CityNode, Integer> turns = new HashMap<>(); //min # of turns to get from source to city <city index, turns>
        Queue<CityNode> queue = new LinkedList<>(); //queue of unvisited cities

        //Initialize turns and parents HashMaps
        //Source city also starts at -1 turns
        for (CityNode city : adjList.keySet()){
            turns.put(city, -1);
        }
        queue.add(cityS);
        
        //find least number of turns to get from each city to source city until target city is reached
        while (!queue.isEmpty()){
            CityNode u = queue.remove(); //get index of next city in queue
            for (CityNode c : adjList.get(u)){ //for every city adjacent to city u
                if (turns.get(c) == -1){ //if city c is unvisited
                    turns.put(c, turns.get(u) + 1);
                    queue.add(c);

                    //return min # of turns if target city is found
                    if (c.getIndex() == cityT.getIndex()){
                        return turns.get(cityT);
                    }
                }

            }
        }
        
        //Should never reach this point
        return -100;
    }

    /**
     * Finds the minimum distance between the source and target city using Dijkstra's algorithm
     * All paths are checked, so minimum distances between each city to the source city is found
     * before specifically seeking out the distance of the target city from the source city
     * 
     * Throws an IllegalArgumentException if either of the given cities don't exist in the graph
     * 
     * @param source name of source city
     * @param target name of target city
     * @return minumum distance between source and target city
     */
    public double findMinDistance(String source, String target){

        //Get cities
        CityNode cityS = getCity(source);
        CityNode cityT = getCity(target);
        
        //Handle case where source city = target city
        if (cityS.getIndex() == cityT.getIndex()){
            return 0.0;
        }

        // Map<CityNode, Double> distances = new HashMap<>(); //min distances from source to each city <city, distance>
        ArrayList<CityNode> visited = new ArrayList<>(); //visited cities
        PriorityQueue<CityNode> pq = new PriorityQueue<>(); //priority queue of unvisited cities

        //Initialize source distance to 0 and all other city distances to -1
        for (CityNode city : adjList.keySet()){
            city.setDistance(-1.0); //resetting status of cities to "unvisited"
        }
        cityS.setDistance(0.0);
        pq.add(cityS); //add source city to pq
        
        //Get shortest paths of each city to source city
        while (!pq.isEmpty()){
            CityNode u = pq.remove(); //get index of next city in queue
            visited.add(u);
            for (CityNode c : adjList.get(u)){ //for every city adjacent to city u
                if (visited.indexOf(c) == -1){ //if city c is unvisited
                    double tempDist = u.getDistance() + distMatrix[u.getIndex()][c.getIndex()];
                    double ogDist = c.getDistance();
                    if (!(ogDist != -1.0 && tempDist > ogDist)){
                        c.setDistance(tempDist);
                        pq.add(c);
                    }
                }
            }
        }        
        return cityT.getDistance();
    }

    /////////////////////////////////////////////////
    //// Helper Methods (some used in unit tests) ///
    /////////////////////////////////////////////////

    /**
     * Returns size of CityGraph (# of CityNodes)
     * 
     * @return size of CityGraph
     */
    public int getSize(){
        return SIZE;
    }

    /**
     * Gets index of the CityNode with the given name
     * Returns -1 if DNE in the graph
     * 
     * @param name name of CityNode
     * @return index of CityNode with given name, -1 if DNE
     */
    public int getIndex(String name){
        CityNode temp = new CityNode(name, 0);
        return cityList.indexOf(temp);
    }

    /**
     * Returns the CityNode with the given name provided it exists
     * If CityNode with the given name DNE, throw an IllegalArgumentException
     * 
     * @param name name of CityNode to get
     * @return CityNode in graph with the given name
     */
    private CityNode getCity(String name){
        int i = getIndex(name);
        if(i == -1){ 
            throw new IllegalArgumentException("Invalid city entered");
        }
        return cityList.get(i);
    }

}
