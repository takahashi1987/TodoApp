class Task < ApplicationRecord
  enum status: { incompleted: false, completed: true }
end
