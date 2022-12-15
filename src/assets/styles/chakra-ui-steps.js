import { StepsStyleConfig as Steps } from 'chakra-ui-steps';
import { mode } from '@chakra-ui/theme-tools';

const baseStyleLabel = props => {
  return {
    color: mode(`gray.900`, `gray.100`)(props),
    fontWeight: 'bolder',
    textAlign: 'center',
    marginLeft: '15px',
    fontSize: 'lg',
  };
};
const baseStyleDescription = props => ({
  color: mode(`gray.500`, `gray.200`)(props),
  marginTop: '2px',
  fontWeight: 'medium',
  marginLeft: '10px',
  fontSize: 'sm',
  // wordSpacing: '50px',
});

const baseStyleStepIconContainer = props => {
  const { colorScheme: c } = props;
  const activeColor = `${c}.500`;

  return {
    display: 'flex',
    borderRadius: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    bg: 'white',
    borderColor: '#5081ED',
    transitionProperty: 'background, border-color',
    transitionDuration: 'normal',
    _activeStep: {
      bg: 'white',
      borderColor: '#5081ED',
      _invalid: {
        bg: 'red.500',
        borderColor: 'red.500',
      },
    },
    _highlighted: {
      bg: activeColor,
      borderColor: activeColor,
    },
    '&[data-clickable]:hover': {
      borderColor: activeColor,
    },
  };
};

const CustomSteps = {
  ...Steps,
  baseStyle: props => {
    return {
      ...Steps.baseStyle(props),
      label: baseStyleLabel(props),
      description: baseStyleDescription(props),
      stepIconContainer: baseStyleStepIconContainer(props),
      labelContainer: {
        ...Steps.baseStyle(props).labelContainer,
        display: 'flex',
        flexDirection: 'row',
        marginLeft: '10px',
      },
      icon: {
        ...Steps.baseStyle(props).icon,
        color: 'rgb(59 130 246)',
        strokeWidth: '10px',
      },
    };
  },
};

export default CustomSteps;
