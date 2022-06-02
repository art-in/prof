#pragma once

#include <chrono>
#include <fstream>
#include <iostream>
#include <json.hpp>
#include <stack>
#include <string>
#include <vector>

namespace prof {

struct TaskInfo {
  std::string name;
  std::chrono::time_point<std::chrono::steady_clock> start;
  std::chrono::time_point<std::chrono::steady_clock> finish;
  std::vector<TaskInfo> children;
};

#define UNIQ_NAME_IMPL(lineno) _a_local_var_##lineno
#define UNIQ_NAME(lineno) UNIQ_NAME_IMPL(lineno)

#define PROFILE_TASK(name) ::prof::Task UNIQ_NAME(__LINE__){name};

class Profile {
 public:
  static auto instance() -> Profile&;

  void startTask(std::string name);
  void finishTask();

  void serialize(std::ostream& out) const;

 private:
  std::stack<TaskInfo> tasks;

  Profile() = default;
  void serializeRecursively(const TaskInfo& task,
                            nlohmann::ordered_json& json) const;
};

class Task {
 public:
  explicit Task(std::string name);
  ~Task();
};

void serialize(std::ostream& out);

}  // namespace prof
