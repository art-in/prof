#include <iostream>

#include "prof.hpp"

auto main() -> int {
  // TODO: add unit tests
  {
    PROFILE_TASK("A");

    { PROFILE_TASK("B"); }
    { PROFILE_TASK("C"); }
  }

  prof::serialize(std::cout);
}