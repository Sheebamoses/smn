package com.ubs.opsit.interviews;

import static com.ubs.opsit.interviews.TimeConstants.*;

public class BerlinTime {

    private String berlinTime;

    BerlinTime(){
        this("00:00:00");
    }

    BerlinTime(String inputTime){
        String[] timeParts = inputTime.split(TIME_DELIMITER);

        this.berlinTime = new StringBuilder()
                                .append(convertToBerlin(Integer.parseInt(timeParts[2].toString()),SECONDS))
                                .append(convertToBerlin(Integer.parseInt(timeParts[0].toString()),HOUR))
                                .append(convertToBerlin(Integer.parseInt(timeParts[1].toString()),MINUTE))
                                .toString();
    }

    private StringBuilder convertToBerlin(Integer value, String unit){

        StringBuilder berlinString = new StringBuilder();
        switch(unit){
            case HOUR:
                berlinString.append(getHourLine1(value));
                berlinString.append(NEW_LINE);
                berlinString.append(getHourLine2(value));
                berlinString.append(NEW_LINE);
                break;

            case MINUTE:
               berlinString.append(getMinuteLine1(value));
               berlinString.append(NEW_LINE);
               berlinString.append(getMinuteLine2(value));
               break;

            case SECONDS:
               berlinString.append(getSecondsLine(value));
               berlinString.append(NEW_LINE);
               break;
        };

        return berlinString;
    }

    private StringBuilder getHourLine1(Integer value){

        StringBuilder hourLine1 = new StringBuilder();
        for (int i=0; i< value/TIME_VALUE_PER_SLOT ;i++){
            hourLine1.append(RED);
        }
        for (int i=0; i< HOUR_LINE1_MAX_SLOT - value/TIME_VALUE_PER_SLOT; i++) {
            hourLine1.append(OFF);
        }
        return hourLine1;
    }

    private StringBuilder getHourLine2(Integer value) {
        StringBuilder hourLine2 = new StringBuilder();
        for (int i = 0; i < value % TIME_VALUE_PER_SLOT; i++) {
            hourLine2.append(RED);
        }
        for (int i = 0; i < HOUR_LINE2_MAX_SLOT - value % TIME_VALUE_PER_SLOT; i++) {
            hourLine2.append(OFF);
        }
        return hourLine2;
    }

    private StringBuilder getMinuteLine1(Integer value){
        StringBuilder minuteLine1 = new StringBuilder();
        for (int i=0; i< value/TIME_VALUE_PER_SLOT;i++){
            if ((i+1) % MINUTE_QUARTER == 0) {
                minuteLine1.append(RED);
            }
            else {
                minuteLine1.append(YELLOW);
            }
        }
        for (int i=0; i< MINUTE_LINE1_MAX_SLOT - value/TIME_VALUE_PER_SLOT; i++) {
            minuteLine1.append(OFF);
        }
        return minuteLine1;
    }


    private StringBuilder getMinuteLine2(Integer value){
        StringBuilder minuteLine2 = new StringBuilder();
        for (int i=0 ; i< value%TIME_VALUE_PER_SLOT ;  i++) {
            minuteLine2.append(YELLOW);
        }
        for (int i=0 ; i< MINUTE_LINE2_MAX_SLOT - value%TIME_VALUE_PER_SLOT ;  i++) {
            minuteLine2.append(OFF);
        }
        return minuteLine2;
    }

    private StringBuilder getSecondsLine(Integer value){
        StringBuilder secondsLine = new StringBuilder();
        if ((value%SECONDS_BLINK) == 0 ) {
            secondsLine.append(YELLOW);
        }
        else {
            secondsLine.append(OFF);
        }
        return secondsLine;
    }

    @Override
    public String toString(){
        return berlinTime;
    }
}
