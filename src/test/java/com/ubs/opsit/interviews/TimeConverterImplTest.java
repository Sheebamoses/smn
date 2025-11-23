package com.ubs.opsit.interviews;

import static org.junit.Assert.assertEquals;
import org.junit.Test;

public class TimeConverterImplTest {

    private static final String NEW_LINE = "\r\n";
    private static final String ERROR_MESSAGE = "Invalid Input Enter 24 Hr Time in HH:MM:SS Format" ;

    @Test
    public void validateTest(){

        TimeConverter tc = new TimeConverterImpl();

        assertEquals("Valid Input",true,((TimeConverterImpl) tc).isValid("10:10:10"));
        assertEquals("Invalid Input",false,((TimeConverterImpl) tc).isValid("10:12:1233"));
        assertEquals("Invalid Input",false,((TimeConverterImpl) tc).isValid("30:10:10"));
        assertEquals("Invalid Input",false,((TimeConverterImpl) tc).isValid("02:100:34"));
        assertEquals("Invalid Input",false,((TimeConverterImpl) tc).isValid("10:5:34"));
        assertEquals("Invalid Input",false,((TimeConverterImpl) tc).isValid("1:05:34"));
        assertEquals("Valid Input",true,((TimeConverterImpl) tc).isValid("00:00:00"));
        assertEquals("Valid Input",true,((TimeConverterImpl) tc).isValid("24:00:00"));
    };


    @Test
    public void convertTimeTest(){

        TimeConverter tc = new TimeConverterImpl();

        assertEquals("As expected", "Y"+NEW_LINE +"OOOO" + NEW_LINE+ "OOOO" + NEW_LINE + "OOOOOOOOOOO" + NEW_LINE +"OOOO", tc.convertTime("00:00:00"));

        assertEquals("As expected", "O"+NEW_LINE+"OOOO"+NEW_LINE+"OOOO"+NEW_LINE+"OOOOOOOOOOO"+NEW_LINE+"OOOO", tc.convertTime("00:00:01"));

        assertEquals("As expected","O"+NEW_LINE+"RROO"+NEW_LINE+"RRRO"+NEW_LINE+"YYROOOOOOOO"+NEW_LINE+"YYOO", tc.convertTime("13:17:01"));

        assertEquals("As expected", "Y"+NEW_LINE+"OOOO"+NEW_LINE+"OOOO"+NEW_LINE+"YYRYYRYYRYY"+NEW_LINE+"YYYY", tc.convertTime("00:59:00"));

        assertEquals("As expected", "Y"+NEW_LINE+"OOOO"+NEW_LINE+"RRRR"+NEW_LINE+"YYOOOOOOOOO"+NEW_LINE+"YYOO", tc.convertTime("04:12:00"));

        assertEquals("As expected", "O"+NEW_LINE+"RRRO"+NEW_LINE+"ROOO"+NEW_LINE+"YYROOOOOOOO"+NEW_LINE+"OOOO", tc.convertTime("16:15:11"));
        assertEquals("As expected", "Y"+NEW_LINE+"RROO"+NEW_LINE+"OOOO"+NEW_LINE+"YYOOOOOOOOO"+NEW_LINE+"YYOO", tc.convertTime("10:12:12"));

        assertEquals("As expected", "O"+NEW_LINE+
                "RRRR"+NEW_LINE+
                "RRRO"+NEW_LINE+
                "YYRYYRYYRYY"+NEW_LINE+
                "YYYY", ((TimeConverterImpl) tc).convertTime("23:59:59"));
        assertEquals("As expected", "Y"+NEW_LINE+
                "RRRR"+NEW_LINE+
                "RRRR"+NEW_LINE+
                "OOOOOOOOOOO"+NEW_LINE+
                "OOOO", ((TimeConverterImpl) tc).convertTime("24:00:00"));

     }

     @Test
     public void convertTime_InvalidInput_Test(){
        TimeConverter tc = new TimeConverterImpl();
        assertEquals(ERROR_MESSAGE,tc.convertTime("42:23:09"));
     }



}

