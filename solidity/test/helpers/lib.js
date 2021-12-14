function decodeLogs(logs, emitter, eventName) {
	let abi;
	let address;
	abi = emitter.abi;
	try {
		address = emitter.address;
	} catch (e) {
		address = null;
	}

	let eventABI = abi.filter((x) => x.type === "event" && x.name === eventName);
	if (eventABI.length === 0) {
		throw new Error(`No ABI entry for event '${eventName}'`);
	} else if (eventABI.length > 1) {
		throw new Error(`Multiple ABI entries for event '${eventName}', only uniquely named events are supported`);
	}

	eventABI = eventABI[0];

	// The first topic will equal the hash of the event signature
	const eventSignature = `${eventName}(${eventABI.inputs.map((input) => input.type).join(",")})`;
	const eventTopic = web3.utils.sha3(eventSignature);

	// Only decode events of type 'EventName'
	return logs
		.filter((log) => log.topics.length > 0 && log.topics[0] === eventTopic && (!address || log.address === address))
		.map((log) => web3.eth.abi.decodeLog(eventABI.inputs, log.data, log.topics.slice(1)))
		.map((decoded) => ({ event: eventName, args: decoded }));
}

module.exports = {
  decodeLogs
}