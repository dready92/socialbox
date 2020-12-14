import start from './backend/api-server';
import run from './backend/kafka/events/consumer';
import * as srvNotification from './backend/core/notifications';
import startConsummer, { runSynchronizers } from './backend/core/jmap/inbox-synchronizer';

start();
srvNotification.start();
run();
startConsummer();
runSynchronizers();
