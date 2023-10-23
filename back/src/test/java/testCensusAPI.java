import edu.brown.cs.student.main.Exceptions.CountyDoesNotExistException;
import edu.brown.cs.student.main.Server.ACSCensusDataSource;
import edu.brown.cs.student.main.Server.BroadbandData;
import edu.brown.cs.student.main.Server.Server;
import java.io.IOException;
import java.util.HashMap;
import org.testng.Assert;
import org.testng.annotations.Test;

public class testCensusAPI {

  /**
   * Making sure our api call and subsequent data retrieved from it are correct. Our
   * implementation converts this data back into a json
   * @throws IOException
   * @throws CountyDoesNotExistException: if we make a search that results in a county that
   * does not exist being found.
   */
  @Test
  public void testCensusDataCanLoadReal() throws IOException, CountyDoesNotExistException {
    Server server = new Server();

    ACSCensusDataSource acsData = new ACSCensusDataSource();
    acsData.setMappings();
    HashMap<String, String> mappings = Server.getStateCode();
    Assert.assertEquals("06", mappings.get("California"));
    Assert.assertFalse(mappings.containsKey("Brown University"));

    BroadbandData object = acsData.getPercentage("California", "Los Angeles County");
    Assert.assertEquals(object.broadbandData().size(), 2);

    //BroadbandData expected = new BroadbandData();
    Assert.assertTrue(object.broadbandData().containsKey("Time"));
    Assert.assertEquals(object.broadbandData().get("Los Angeles County, California"), "89.9");
  }


}
