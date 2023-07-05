import { ActionType } from '@/_types_';
import { useBoolean } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';


const useCountdown = (targetDate: number, onAction: (action: ActionType) => void) => {
  const countDownDate = new Date(targetDate).getTime();

  const [countDown, setCountDown] = useState(
    countDownDate - new Date().getTime()
  );
  const isTimerEndedRef = useRef(false);

  
  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);
    if (!isTimerEndedRef.current && countDown <= 0) {
      clearInterval(interval);
      isTimerEndedRef.current = true;
      onAction("FINISH");
    }
    return () => clearInterval(interval);
  }, [countDownDate]);
  return getReturnValues(countDown);
};

const getReturnValues = (countDown: number) => {
  // calculate time left
  const days = Math.max(0, Math.floor(countDown / (1000 * 60 * 60 * 24)));
  const hours = Math.max(0, Math.floor(
    (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  ));
  const minutes = Math.max(0, Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60)));
  const seconds = Math.max(0, Math.floor((countDown % (1000 * 60)) / 1000));
  return [days, hours, minutes, seconds];
};

export { useCountdown };