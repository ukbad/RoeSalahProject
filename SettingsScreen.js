const toggleSwitch = async () => {
    const newFormat = !is24HourFormat;
    setIs24HourFormat(newFormat);
    await AsyncStorage.setItem('timeFormat', newFormat ? '24' : '12'); // Save as '24' or '12'
};
