import EVENTS from '../events.js';
import scrollToIndex from './scrollToIndex.js';
import { getToolState } from '../stateManagement/toolState.js';
import clip from './clip.js';

function scrollWithoutSkipping (stackData, pendingEvent, element) {
  if (stackData.pending[0] === pendingEvent) {
    if (stackData.currentImageIdIndex === pendingEvent.index) {
      stackData.pending.splice(stackData.pending.indexOf(pendingEvent), 1);

      if (stackData.pending.length > 0) {
        scrollWithoutSkipping(stackData, stackData.pending[0], element);
      }

      return;
    }

    const newImageHandler = function (event) {
      const index = stackData.imageIds.indexOf(event.detail.image.imageId);

      if (index === pendingEvent.index) {
        stackData.pending.splice(stackData.pending.indexOf(pendingEvent), 1);
        element.removeEventListener(EVENTS.NEW_IMAGE, newImageHandler);

        if (stackData.pending.length > 0) {
          scrollWithoutSkipping(stackData, stackData.pending[0], element);
        }
      }
    };

    element.addEventListener(EVENTS.NEW_IMAGE, newImageHandler);

    scrollToIndex(element, pendingEvent.index);
  }
}

export default function (element, images, loop = false, allowSkipping = true) {
  const toolData = getToolState(element, 'stack');

  if (!toolData || !toolData.data || !toolData.data.length) {
    return;
  }

  const stackData = toolData.data[0];

  if (!stackData.pending) {
    stackData.pending = [];
  }

  let newImageIdIndex = stackData.currentImageIdIndex + images;

  if (loop) {
    const nbImages = stackData.imageIds.length;

    newImageIdIndex %= nbImages;
  } else {
    newImageIdIndex = clip(newImageIdIndex, 0, stackData.imageIds.length - 1);
  }

  if (allowSkipping) {
    scrollToIndex(element, newImageIdIndex);
  } else {
    const pendingEvent = {
      index: newImageIdIndex
    };

    stackData.pending.push(pendingEvent);
    scrollWithoutSkipping(stackData, pendingEvent, element);
  }
}
