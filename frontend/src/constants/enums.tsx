export enum AlertSeverity {
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
  Success = 'success',
}

export enum ErrorMessages {
  StartDateLaterEndDateMsg = 'Start date is later than end date, which is not allowed',
  ClickingOnEventMsg = 'Something went wrong when clicking on the event',
  DeleteEventMsg = 'Something went wrong when deleting the event',
  UpdateEventMsg = 'Something went wrong when updating the event',
  PasswordsDoNotMatch = 'Passwords do not match',
  DraggingEvent = 'Something went wrong when dragging event and the event will not be updated',
}

export enum ConstantSnackMessages {
  NewActivityAdded = 'New activity was added to calendar',
  ActivityUpdated = 'Activity was updated successfully',
  ActivityDeleted = 'Activity was successfully deleted',
}