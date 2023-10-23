package edu.brown.cs.student.main.Server;

import edu.brown.cs.student.main.Server.ACSCensusDataSource.Value;
import java.util.HashMap;

/**
 * This class determines the desired format
 * in which the Broadband data is returned
 * @param broadbandData
 */
public record BroadbandData(HashMap<String, Object> broadbandData) {

}
