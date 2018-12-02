package com.ubs.opsit.interviews;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class BerlinTimeTest {

    private static final String NEW_LINE = "\r\n";

    @Test
    public void BerlinTime_Default_Test(){

        BerlinTime bt = new BerlinTime();

        assertEquals("As expected", "Y"+NEW_LINE +"OOOO" + NEW_LINE+ "OOOO" + NEW_LINE + "OOOOOOOOOOO" + NEW_LINE +"OOOO", bt.toString());
    }
}
