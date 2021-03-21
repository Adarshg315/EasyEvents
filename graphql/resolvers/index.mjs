import authResolver from "./auth.mjs";
import eventsResolver from "./events.mjs";
import bookingResolver from "./booking.mjs";

const rootResolver = {
	...authResolver,
	...eventsResolver,
	...bookingResolver,
};

export default rootResolver;
