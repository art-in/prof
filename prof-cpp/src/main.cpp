#include <iostream>
#include <test-runner.hpp>

void TestProf(TestRunner*);

auto main() -> int {
  TestRunner trun;
  TestProf(&trun);
}