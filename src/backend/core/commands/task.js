import KafkaMessage from '../../kafka/kafka-message';
import sendEvent from '../../kafka/events/producer';
import logger from '../logger';
import Actor from '../../../shared/actor';
import Task from '../../../shared/task';

const debug = logger.extend('commands:task');

export async function createTask(task) {
  const taskObject = Task.fromObject(task);
  const message = {
    event: 'email:task:create',
    sender: Actor.fromUser(task.creator),
    payload: taskObject,
  };
  debug('Publishing to Kafka %O', message);

  const kafkaMessage = KafkaMessage.fromObject(task.assignee._id, message);

  await sendEvent(kafkaMessage);
}

export async function updateDoneStatus(actor, emailId, taskId, done) {
  if (done !== true && done !== false) {
    throw new Error('done should be a boolean');
  }
  const message = {
    event: 'email:task:done-status:update',
    sender: Actor.fromUser(actor),
    payload: {
      emailId,
      taskId,
      done,
    },
  };

  debug('Publishing to Kafka %O', message);

  const kafkaMessage = KafkaMessage.fromObject(actor._id, message);

  await sendEvent(kafkaMessage);
}
