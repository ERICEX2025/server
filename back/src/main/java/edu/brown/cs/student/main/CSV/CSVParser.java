package edu.brown.cs.student.main.CSV;

import edu.brown.cs.student.main.DataObject.CreatorFromRow;
import edu.brown.cs.student.main.DataObject.FactoryFailureException;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.Reader;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

public class CSVParser<T> {

  private final BufferedReader reader;
  private final CreatorFromRow<T> rowCreator;
  static final Pattern regexSplitCSVRow =
      Pattern.compile(",(?=([^\\\"]*\\\"[^\\\"]*\\\")*(?![^\\\"]*\\\"))");

  public CSVParser(Reader reader, CreatorFromRow<T> rowCreator) {
    this.reader = new BufferedReader(reader);
    this.rowCreator = rowCreator;
  }

  public List<T> parse() throws IOException, FactoryFailureException {
    List<T> result = new ArrayList<>();
    String line;
    while ((line = reader.readLine()) != null) {
      List<String> row = arrayToList(regexSplitCSVRow.split(line));
      try {
        T dataObject = rowCreator.create(row);
        result.add(dataObject);
      } catch (FactoryFailureException e) {
        String errorMessage = "Failed to create data object for row ";
        throw new FactoryFailureException(errorMessage, row);
      }
    }
    if (result.isEmpty()) {
      System.out.println("Nothing to parse, the reader contains wraps an empty csv");
    }
    return result;
  }

  public void close() throws IOException {
    reader.close();
  }

  // Helper method to convert String[] to List<String>
  private static List<String> arrayToList(String[] array) {
    List<String> list = new ArrayList<>();
    for (String str : array) {
      list.add(postprocess(str));
    }
    return list;
  }

  /**
   * Elimiate a single instance of leading or trailing double-quote, and replace pairs of double
   * quotes with singles.
   *
   * @param arg the string to process
   * @return the postprocessed string
   */
    public static String postprocess(String arg) {
      return arg
          // Remove extra spaces at beginning and end of the line
          .trim()
          // Remove a beginning quote, if present
          .replaceAll("^\"", "")
          // Remove an ending quote, if present
          .replaceAll("\"$", "")
          // Replace double-double-quotes with double-quotes
          .replaceAll("\"\"", "\"");
    }
}
