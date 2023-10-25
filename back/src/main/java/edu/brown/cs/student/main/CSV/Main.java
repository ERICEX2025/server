package edu.brown.cs.student.main.CSV;

import edu.brown.cs.student.main.CSV.CSVParser;
import edu.brown.cs.student.main.CSV.CSVSearcher;
import edu.brown.cs.student.main.DataObject.CreatorFromRow;
import edu.brown.cs.student.main.DataObject.FactoryFailureException;
import edu.brown.cs.student.main.DataObject.StringList;
import edu.brown.cs.student.main.Exceptions.IdentifierNotFoundException;
import edu.brown.cs.student.main.Exceptions.TermNotFoundException;
import edu.brown.cs.student.main.Exceptions.TermNotFoundInSpecifiedColumnException;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.List;

/** todo testing commenting */
public final class Main {

  private final String[] args;

  /**
   * @param args An array of command line arguments <filename> <search term> <has headers?>
   *     <optional column index/name> example input: ./data/census/postsecondary_education.csv Women
   *     true 8
   */
  public static void main(String[] args) throws IOException, FactoryFailureException {
    if (args.length > 4 || args.length < 3) {
      throw new IllegalArgumentException(
          "Invalid number of arguments. Expected <filename> <search term> <has headers?> "
              + "and optionally <column index/name>.");
    }
    new Main(args).run();
  }

  private Main(String[] args) {
    this.args = args;
  }

  private void run() {
    // dear student: you can remove this. you can remove anything. you're in cs32. you're free!
    // what if I don't want to remove this. I want to include this message as a feature >:D
    //    System.out.println(
    //        "Your horoscope for this project:\n"
    //            + "Entrust in the Strategy pattern, and it shall give thee the sovereignty to "
    //            + "decide and the dexterity to change direction in the realm of thy code.");

    CreatorFromRow<List<String>> stringList = new StringList();

    try {
      FileReader fileReader = new FileReader(args[0]);

      String searchTerm = args[1];
      Boolean hasHeaders = Boolean.parseBoolean(args[2]);
      String columnIdentifier = null;
      if (args.length == 4) {
        columnIdentifier = args[3];
      }

      CSVParser<List<String>> parser = new CSVParser<>(fileReader, stringList);
      CSVSearcher searcher = new CSVSearcher(parser, searchTerm, hasHeaders, columnIdentifier);
      searcher.print(searcher.search());

    } catch (FileNotFoundException e) {
      System.err.println("File not found: " + args[0]);
      System.exit(1);
    } catch (IdentifierNotFoundException e) {
      System.err.println("Identifier not found");
      System.exit(1);
    } catch (TermNotFoundException e) {
      System.err.println("Term not found");
      System.exit(1);
    } catch (TermNotFoundInSpecifiedColumnException e) {
      System.err.println("Term not found in column!");
      System.exit(1);
    } catch (IOException e) {
        System.err.println("IOException!");
        System.exit(1);
    } catch (FactoryFailureException e) {
        System.err.println("FactoryFailureException");
        System.exit(1);
    }
  }
}
