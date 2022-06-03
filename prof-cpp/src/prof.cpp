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

auto Profile::rootTask() const
    -> std::optional<std::reference_wrapper<const TaskInfo>> {
  if (tasks.empty()) {
    return std::nullopt;
  }

  return std::cref(tasks.top());
}

void Profile::serialize(std::ostream& out) const {
  if (tasks.size() != 1) {
    // make sure recorded tasks exist and all of them are completed,
    // in this case singe root task should lay on top of the stack
    return;
  }

  nlohmann::ordered_json json;
  serializeRecursively(tasks.top(), json);
  out << std::setw(2) << json;
}

void Profile::reset() { tasks = {}; }

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

auto rootTask() -> std::optional<std::reference_wrapper<const TaskInfo>> {
  return Profile::instance().rootTask();
}

void serialize(std::ostream& out) { Profile::instance().serialize(out); }

void serializeToFile(const std::string& filePath) {
  std::ofstream fout{filePath};
  Profile::instance().serialize(fout);
}

void reset() { Profile::instance().reset(); }

}  // namespace prof