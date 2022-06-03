#pragma once

#include <cmath>
#include <iostream>
#include <limits>
#include <map>
#include <set>
#include <sstream>
#include <stdexcept>
#include <string>
#include <unordered_map>
#include <vector>

template <class T>
auto operator<<(std::ostream& os, const std::vector<T>& s) -> std::ostream& {
  os << "{";
  bool first = true;
  for (const auto& x : s) {
    if (!first) {
      os << ", ";
    }
    first = false;
    os << x;
  }
  return os << "}";
}

template <class T>
auto operator<<(std::ostream& os, const std::set<T>& s) -> std::ostream& {
  os << "{";
  bool first = true;
  for (const auto& x : s) {
    if (!first) {
      os << ", ";
    }
    first = false;
    os << x;
  }
  return os << "}";
}

template <class K, class V>
auto operator<<(std::ostream& os, const std::map<K, V>& m) -> std::ostream& {
  os << "{";
  bool first = true;
  for (const auto& kv : m) {
    if (!first) {
      os << ", ";
    }
    first = false;
    os << kv.first << ": " << kv.second;
  }
  return os << "}";
}

template <class K, class V>
auto operator<<(std::ostream& os, const std::unordered_map<K, V>& m)
    -> std::ostream& {
  os << "{";
  bool first = true;
  for (const auto& kv : m) {
    if (!first) {
      os << ", ";
    }
    first = false;
    os << kv.first << ": " << kv.second;
  }
  return os << "}";
}

template <class T, class U>
void AssertEqual(const T& t, const U& u, const std::string& hint = {}) {
  if (!(t == u)) {
    std::ostringstream os{};
    os << "Assertion failed: " << t << " != " << u;
    if (!hint.empty()) {
      os << " hint: " << hint;
    }
    throw std::runtime_error(os.str());
  }
}

template <class T>
inline void AssertApproxEqual(const T a, const T b,
                              const std::string& hint = {}) {
  static const double DELTA = std::pow(10, -8);  // NOLINT
  if (std::fabs(a - b) > DELTA) {
    std::ostringstream os{};
    os << "Assertion failed: " << a << " != (approx) " << b;
    if (!hint.empty()) {
      os << " hint: " << hint;
    }
    throw std::runtime_error(os.str());
  }
}

inline void Assert(bool b, const std::string& hint) {
  AssertEqual(b, true, hint);
}

class TestRunner {
 public:
  template <class TestFunc>
  void RunTest(TestFunc func, const std::string& test_name) {
    try {
      func();
      ++success_count;
      std::cerr << test_name << " OK" << std::endl;
    } catch (std::exception& e) {
      ++fail_count;
      std::cerr << test_name << " fail: " << e.what() << std::endl;
    } catch (...) {
      ++fail_count;
      std::cerr << "Unknown exception caught" << std::endl;
    }
  }

  ~TestRunner() {
    if (fail_count > 0) {
      std::cerr << fail_count << " unit tests failed. Terminate" << std::endl;
      exit(1);
    } else {
      std::cerr << success_count << " unit tests succeed!" << std::endl;
    }
  }

 private:
  int success_count = 0;
  int fail_count = 0;
};

// unique tag for variable names inside macros, to avoid name conflict with
// variables from parent scope
#define UNIQUE TEST_RUNNER__##__LINE__

#define ASSERT_EQUAL(x, y)                                                   \
  {                                                                          \
    std::ostringstream os##UNIQUE;                                           \
    os##UNIQUE << #x << " != " << #y << ", " << __FILE__ << ":" << __LINE__; \
    AssertEqual(x, y, os##UNIQUE.str());                                     \
  }

#define ASSERT_APPROX_EQUAL(x, y)                                            \
  {                                                                          \
    std::ostringstream os##UNIQUE;                                           \
    os##UNIQUE << #x << " != " << #y << ", " << __FILE__ << ":" << __LINE__; \
    AssertApproxEqual(x, y, os##UNIQUE.str());                               \
  }

#define ASSERT(x)                                                     \
  {                                                                   \
    std::ostringstream os##UNIQUE;                                    \
    os##UNIQUE << #x << " is false, " << __FILE__ << ":" << __LINE__; \
    Assert(x, os##UNIQUE.str());                                      \
  }

#define RUN_TEST(tr, func) (tr).RunTest(func, #func)
