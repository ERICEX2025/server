package edu.brown.cs.student.main.Server;

import edu.brown.cs.student.main.Exceptions.CountyDoesNotExistException;

/**
 * interface for Census data sources
 * for extensibility purposes
 * if you want to use other census data sources
 * like one for international locations
 */
public interface CensusDataSource {
  BroadbandData getPercentage(String state, String county) throws CountyDoesNotExistException;
}
