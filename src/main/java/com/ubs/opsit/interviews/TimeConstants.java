package com.ubs.opsit.interviews;

class TimeConstants {

    static final String TIME24HOURS_PATTERN = "([01]?[0-9]|2[0-4]):[0-5][0-9]:[0-5][0-9]";
    static final String TIME_DELIMITER = ":";
    static final String ERROR_MESSAGE = "Invalid Input Enter 24 Hr Time in HH:MM:SS Format" ;

    static final String HOUR = "hour";
    static final String MINUTE = "minute";
    static final String SECONDS = "seconds";
    static final String NEW_LINE = "\r\n";
    static final int TIME_VALUE_PER_SLOT = 5;
    static final int HOUR_LINE1_MAX_SLOT = 4;
    static final int MINUTE_LINE1_MAX_SLOT = 11;
    static final int HOUR_LINE2_MAX_SLOT = 4;
    static final int MINUTE_LINE2_MAX_SLOT = 4;
    static final int SECONDS_BLINK = 2;
    static final int MINUTE_QUARTER = 3;
    static final char RED = 'R';
    static final char OFF = 'O';
    static final char YELLOW = 'Y';

}
