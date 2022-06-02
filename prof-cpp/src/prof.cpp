#include "prof.hpp"

namespace prof {

auto Profile::instance() -> Profile& {
  // TODO(artin): support adding tasks to same profile from multiple threads
  thread_local Profile instance;
  return instance;
}

void Profile::startTask(std::string name) {
  auto now = std::chrono::steady_clock::now();

  if (tasks.empty()) {
    tasks.push({.name = "root", .start = now});
  }

  tasks.push({.name = std::move(name), .start = now});
}

void Profile::finishTask() {
  auto now = std::chrono::steady_clock::now();

  auto currentTask = tasks.top();
  tasks.pop();

  currentTask.finish = now;

  auto& parentTask = tasks.top();
  parentTask.children.push_back(currentTask);

  if (tasks.size() == 1) {
    parentTask.finish = now;
  }
}

void Profile::serialize(std::ostream& out) const {
  nlohmann::ordered_json json;
  serializeRecursively(tasks.top(), json);
  out << std::setw(2) << json;
}

void Profile::serializeRecursively(const TaskInfo& task,
                                   nlohmann::ordered_json& json) const {
  json["name"] = task.name;
  json["duration_ns"] = std::chrono::duration_cast<std::chrono::nanoseconds>(
                            task.finish - task.start)
                            .count();

  for (const auto& childTask : task.children) {
    nlohmann::ordered_json child;
    serializeRecursively(childTask, child);
    json["children"].push_back(child);
  }
}

Task::Task(std::string name) { Profile::instance().startTask(std::move(name)); }

Task::~Task() { Profile::instance().finishTask(); }

void serialize(std::ostream& out) { Profile::instance().serialize(out); }

}  // namespace prof