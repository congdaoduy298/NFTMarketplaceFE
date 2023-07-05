import { HStack, Text } from "@chakra-ui/react";
import DateTimeDisplay from "./DateTimeDisplay";
import { useCountdown } from "./useCountdown";
import { ActionType } from "@/_types_";

interface IProps {
  auctionId: number;
  targetDate: number;
  onAction: (action: ActionType) => void;
}

const ShowCounter = ({
  days,
  hours,
  minutes,
  seconds,
}: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}) => {
  return (
    <HStack px="0px" spacing="3px">
      <Text fontSize="15px" px="0px">
        {"Time Remaining: "}
      </Text>
      <Text fontSize="15px" px="0px">
        {days}
      </Text>
      <Text fontSize="15px">:</Text>
      <Text fontSize="15px">{hours.toString().padStart(2, "0")}</Text>
      <Text fontSize="15px">:</Text>
      <Text fontSize="15px">{minutes.toString().padStart(2, "0")}</Text>
      <Text fontSize="15px">:</Text>
      <Text fontSize="15px">{seconds.toString().padStart(2, "0")}</Text>
      <Text fontSize="15px">left</Text>
    </HStack>
  );
};

const CountdownTimer = ({ auctionId, targetDate, onAction }: IProps) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate, onAction);
  return (
    <ShowCounter
      days={days}
      hours={hours}
      minutes={minutes}
      seconds={seconds}
    />
  );
};

export default CountdownTimer;
