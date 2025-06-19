/**
 * @author Raina Kwok
 * [MSCI 240] Final Project - A
 * Date: Dec 22, 2022
 * 
 * CityNode.java
 * 
 * The CityNode class represents each city in Flatland as a node where each city has a name and an index
 * It implements the Comparable interface:
 * - CityNodes are sorted by their distance (from some source CityNode)
 * - When testing CityNodes for equality, only the name is checked 
 *
 */

import java.util.Objects;

public class CityNode implements Comparable<CityNode>{

    private String name; //Name of the city
    private int index; //Index of the city
    private double distance; //Minimum distance of the city from some source city

    /** 
     * Creates a new CityNode object with the given name and index
     * Distance is set to a default of -1
     * 
     * @param name city name
     * @param index city index
     */
    public CityNode(String name, int index){
        this.name = name;
        this.index = index;
        this.distance = -1.0;
    }

    /**
     * Returns the index of the city
     * 
     * @return index of the city
     */
    public int getIndex(){
        return index;
    }

    /**
     * returns the distance of the city from some source city (or -1 as initialized)
     * 
     * @return distance of city from some source city (or -1 as initialized)
     */
    public double getDistance(){
        return distance;
    }

    /**
     * sets the distance of this city from some source city
     * 
     * @param dist distance from some source city
     */
    public void setDistance(double dist){
        this.distance = dist;
    }

    /**
     * Compares the distance of two CityNode objects
     */
    @Override
    public int compareTo(CityNode city){
        return Double.compare(this.distance, city.distance);
    }
    
    /**
     * Checks for equality of this CityNode with another
     */
    @Override
    public boolean equals(Object other){
        // Source:
        // https://www.sitepoint.com/implement-javas-equals-method-correctly/
        // self check
        if (this == other)
            return true;

        // null check
        if (other == null)
            return false;
        
        // type check and cast
        if (getClass() != other.getClass())
            return false;

        CityNode x = (CityNode) other;

        // field comparison (only check degree for equality)
        return Objects.equals(name, x.name);
    }

    /**
     * Ensures that using a HashMap or HashSet on CityNode
     * objects uses the city's name
     */
    @Override
    public int hashCode() {
        return Objects.hashCode(name);
    }
    
}
