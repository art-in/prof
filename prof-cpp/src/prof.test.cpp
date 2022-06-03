#include "prof.hpp"

#include <iostream>
#include <stdexcept>
#include <test-runner.hpp>

void TestNoTasks() {
  prof::reset();

  // assert
  const auto rootTaskOpt = prof::rootTask();
  ASSERT(!rootTaskOpt.has_value());
}

void TestSingleTask() {
  prof::reset();

  // setup
  { PROFILE_TASK("A"); }

  // assert
  const auto rootTaskOpt = prof::rootTask();
  ASSERT(rootTaskOpt.has_value());

  const auto& rootTask = rootTaskOpt.value().get();

  ASSERT_EQUAL(rootTask.name, "root");
  ASSERT_EQUAL(rootTask.children.size(), 1);

  const auto& taskA = rootTask.children[0];
  ASSERT_EQUAL(taskA.name, "A");
  ASSERT_EQUAL(taskA.children.size(), 0);
}

void TestTaskNesting() {
  prof::reset();

  // setup
  {
    PROFILE_TASK("A");
    { PROFILE_TASK("B"); }
    { PROFILE_TASK("C"); }
  }

  // assert
  const auto rootTaskOpt = prof::rootTask();
  ASSERT(rootTaskOpt.has_value());

  const auto& rootTask = rootTaskOpt.value().get();

  ASSERT_EQUAL(rootTask.name, "root");
  ASSERT_EQUAL(rootTask.children.size(), 1);

  const auto& taskA = rootTask.children[0];
  ASSERT_EQUAL(taskA.name, "A");
  ASSERT_EQUAL(taskA.children.size(), 2);

  const auto& taskB = taskA.children[0];
  ASSERT_EQUAL(taskB.name, "B");
  ASSERT_EQUAL(taskB.children.size(), 0);

  const auto& taskC = taskA.children[1];
  ASSERT_EQUAL(taskC.name, "C");
  ASSERT_EQUAL(taskC.children.size(), 0);
}

void TestExceptionTolerance() {
  prof::reset();

  // setup
  {
    PROFILE_TASK("A");

    try {
      PROFILE_TASK("B");
      throw std::logic_error("boom");
    } catch (...) {
    }

    { PROFILE_TASK("C"); }
  }

  // assert
  const auto rootTaskOpt = prof::rootTask();
  ASSERT(rootTaskOpt.has_value());

  const auto& rootTask = rootTaskOpt.value().get();

  ASSERT_EQUAL(rootTask.name, "root");
  ASSERT_EQUAL(rootTask.children.size(), 1);

  const auto& taskA = rootTask.children[0];
  ASSERT_EQUAL(taskA.name, "A");
  ASSERT_EQUAL(taskA.children.size(), 2);

  const auto& taskB = taskA.children[0];
  ASSERT_EQUAL(taskB.name, "B");
  ASSERT_EQUAL(taskB.children.size(), 0);

  const auto& taskC = taskA.children[1];
  ASSERT_EQUAL(taskC.name, "C");
  ASSERT_EQUAL(taskC.children.size(), 0);
}

void TestProf(TestRunner* trun) {
  RUN_TEST(*trun, TestNoTasks);
  RUN_TEST(*trun, TestSingleTask);
  RUN_TEST(*trun, TestTaskNesting);
  RUN_TEST(*trun, TestExceptionTolerance);
}