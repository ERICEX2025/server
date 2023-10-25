package edu.brown.cs.student.main.CSV;

import edu.brown.cs.student.main.DataObject.FactoryFailureException;
import edu.brown.cs.student.main.Exceptions.IdentifierNotFoundException;
import edu.brown.cs.student.main.Exceptions.TermNotFoundException;
import edu.brown.cs.student.main.Exceptions.TermNotFoundInSpecifiedColumnException;
import edu.brown.cs.student.main.Server.Server;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class CSVSearcher {

  private final String searchTerm;
  private final Boolean hasHeaders;
  private final String columnIdentifier;
  private final List<List<String>> parsed;

  public CSVSearcher(
      String searchTerm,
      Boolean hasHeaders,
      String columnIdentifier) {
    this.searchTerm = searchTerm;
    this.hasHeaders = hasHeaders;
    this.columnIdentifier = columnIdentifier;
    this.parsed = Server.getParsedLoadedCSV();
  }

  public CSVSearcher(CSVParser parser,
          String searchTerm,
          Boolean hasHeaders,
          String columnIdentifier) throws IOException, FactoryFailureException {
    this.searchTerm = searchTerm;
    this.hasHeaders = hasHeaders;
    this.columnIdentifier = columnIdentifier;
    this.parsed = parser.parse();
  }

  /**
   * if there is no column identifier, then search through every column of each row to find and
   * return the rows that have the search term
   */
  public List<List<String>> search()
      throws TermNotFoundException, IdentifierNotFoundException, TermNotFoundInSpecifiedColumnException {
    List<List<String>> result;

    if (this.columnIdentifier == null) {
      result = this.allCol();
      if (checkEmpty(result)) {
        throw new TermNotFoundException("(Case Sensitive) Your Search Term does not exist.", this.searchTerm);
      } else {
        return result;
      }
    }
    // if it has a column name
    else if (!this.columnIdentifier.matches("\\d+")) {
      int col = -1;
      List<String> row = parsed.get(0);
      for (int i = 0; i < row.size(); i++) {
        if ((row.get(i)).equals(this.columnIdentifier)) {
          col = i;
          break;
        }
      }
      if (col == -1) {
        throw new IdentifierNotFoundException("(Case Sensitive) The inputted column identifier name does not exist", this.columnIdentifier);
      }
      result = this.specificCol(col);
      if (checkEmpty(result)) {
        throw new TermNotFoundInSpecifiedColumnException("(Case Sensitive) Your Search Term does not exist in this column", this.searchTerm, this.columnIdentifier);
      } else {
        return result;
      }
    }
    // column index
    else {
      int col = Integer.parseInt(this.columnIdentifier);

      if (col > this.parsed.size() - 1 || col < 0) {
        throw new IdentifierNotFoundException("(Case Sensitive) The inputted column identifier index does not exist", this.columnIdentifier);
      }

      result = this.specificCol(col);
      if (checkEmpty(result)) {
        throw new TermNotFoundInSpecifiedColumnException("(Case Sensitive) Your Search Term does not exist in this column", this.searchTerm, this.columnIdentifier);
      } else {
        return result;
      }
    }
  }

  public List<List<String>> allCol() {
    List<List<String>> result = new ArrayList<>();

    if (this.hasHeaders) {
      this.parsed.remove(0);
    }

    for (List<String> row : this.parsed) {
      for (int j = 0; j < row.size(); j++) {
        if (row.get(j).equals(this.searchTerm)) {
          result.add(row);
          break;
        }
      }
    }

    return result;
  }

  public List<List<String>> specificCol(int col) {
    List<List<String>> result = new ArrayList<>();

    if (this.hasHeaders) {
      this.parsed.remove(0);
    }

    for (List<String> row : this.parsed) {
      if (row.get(col).equals(this.searchTerm)) {
        result.add(row);
      }
    }
    return result;
  }

  public void print(List<List<String>> result) {
    for (List<String> innerList : result) {
      for (String element : innerList) {
        System.out.print(element + " ");
      }
      System.out.println();
    }
  }

  public boolean checkEmpty(List<List<String>> result) {
    for (List<String> innerList : result) {
      if (!innerList.isEmpty()) {
        return false;
      }
    }
    return true;
  }
}
